import csv
import random
from faker import Faker

fake = Faker()

header = [
    "name.firstName", "name.lastName", "age", "address.line1", "address.line2",
    "address.city", "address.state", "gender"
]

records = []
for i in range(1, 75001): 

    first_name = fake.first_name()
    last_name = fake.last_name()


    age = random.randint(18, 80)


    address_line1 = fake.building_number() + " " + fake.street_name()
    address_line2 = fake.secondary_address() if random.choice([True, False]) else ""  

    city = fake.city()
    state = fake.state()

    gender = random.choice(["male", "female"])

    records.append([
        first_name,  
        last_name,  
        age,  
        address_line1,  
        address_line2,  
        city,  
        state,  
        gender 
    ])

with open("users_75000.csv", "w", newline="") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(header)  
    writer.writerows(records) 

print("CSV file with 75,000 records generated successfully.")