import pool from "../config/db";

export const parseNestedFields = (flatObject: any): any => {
  const nestedObject: any = { address: {}, additional_info: {} };

  Object.entries(flatObject).forEach(([key, value]) => {
    if (!value) return;

    const keys = key.split(".");
    if (keys.length === 1) {
      if (["name.firstName", "name.lastName", "age"].includes(key)) {
        if (key === "name.firstName" || key === "name.lastName") {
          nestedObject.name = (nestedObject.name || "") + " " + value;
        } else {
          nestedObject[key] = value;
        }
      } else {
        nestedObject.additional_info[key] = value;
      }
    } else {
      let current = nestedObject;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }
      current[keys[keys.length - 1]] = value;
    }
  });

  return nestedObject;
};

export const calculateAgeDistribution = async (insertedIds: number[]) => {
  if (insertedIds.length === 0) return [];

  const result = await pool.query(
    `SELECT 
        CASE 
          WHEN age < 20 THEN '< 20'
          WHEN age BETWEEN 20 AND 40 THEN '20 to 40'
          WHEN age BETWEEN 41 AND 60 THEN '40 to 60'
          ELSE '> 60'
        END AS age_group,
        COUNT(*) as count
     FROM users
     WHERE id = ANY($1)
     GROUP BY age_group
     ORDER BY age_group;`,
    [insertedIds]
  );

  return result.rows;
};

export const printAgeDistribution = (distribution: any) => {
  console.log("\n===== AGE DISTRIBUTION REPORT =====");
  console.log("Age Group | Count | Percentage");
  console.log("-----------------------------");

  // Calculate total users
  const totalUsers = distribution.reduce(
    (sum: any, group: any) => sum + parseInt(group.count),
    0
  );

  distribution.forEach((group: any) => {
    const percentage = ((group.count / totalUsers) * 100).toFixed(2);
    console.log(
      `${group.age_group.padEnd(9)} | ${group.count
        .toString()
        .padEnd(5)} | ${percentage}%`
    );
  });

  console.log(`\nTotal Users: ${totalUsers}`);
  console.log("==================================\n");
};
