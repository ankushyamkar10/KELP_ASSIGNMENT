import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import fs from "fs";
import { parse } from "fast-csv";
import pool from "../config/db";
import {
  calculateAgeDistribution,
  parseNestedFields,
  printAgeDistribution,
} from "../utils/utils";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
router.use(fileUpload());

const uploadUsers: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    if (!req.files || !req.files.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const file = req.files.file as UploadedFile;
    const filePath = `uploads/${file.name}`;

    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    await file.mv(filePath);

    const users: any[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ headers: true, ignoreEmpty: true }))
      .on("data", (row) => {
        const parsedData = parseNestedFields(row);
        users.push(parsedData);
      })
      .on("end", async () => {
        fs.unlinkSync(filePath);

        try {
          const insertedIds: number[] = [];

          for (const user of users) {
            const { name, age, address } = user;
            const additional_info = { ...user };

            const result = await pool.query(
              `INSERT INTO users (name, age, address, additional_info) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
              [
                `${name.firstName} ${name.lastName}`,
                age,
                JSON.stringify(address || {}),
                JSON.stringify(additional_info || {}),
              ]
            );

            insertedIds.push(result.rows[0].id);
          }

          const ageDistribution = await calculateAgeDistribution(insertedIds);
          printAgeDistribution(ageDistribution);

          res.json({
            message: "CSV uploaded and processed successfully",
            ageDistribution,
          });
        } catch (err) {
          next(err);
        }
      })
      .on("error", (error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const truncateUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Using TRUNCATE is faster than DELETE for removing all rows
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY");

    res.status(200).json({
      success: true,
      message: "All users have been deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

router.route("/users").delete(truncateUsers).post(uploadUsers).get(getAllUsers);

export default router;
