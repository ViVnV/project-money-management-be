// Import PrismaClient from package @prisma/client to access the database using Prisma ORM
const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); // Create an instance of PrismaClient for use in database operations
const bcrypt = require("bcrypt"); // Import bcrypt for hashing passwords
const jwt = require("jsonwebtoken"); // Import jsonwebtoken to generate and verify JWT tokens
const validator = require("validator"); // Import validators for validation of various data such as email

// Function forr register
async function register(req, res) {
    // Validation for the required fields
    if (!req.body.username) {
        return res.status(400).send({ message: "Username required"})
    }
    if (!req.body.email) {
      return res.status(400).send({ message: "Email required" });
    }
    if (!req.body.password) {
      return res.status(400).send({ message: "Password required" });
    }

    // Restructure username, email, and password from req.body
    const { username, email, password } = req.body;

    try {
        // Validating the email 
        const validateEmail = validator.isEmail(email);

        // If the email format is wrong
        if (!validateEmail) {
            return res.status(404).send({ message: "Please use the right email format" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 5);
        // Create the user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).send({ message: "User is created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

// Function for login
async function login(req, res) {
    // Validation for the required fields
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Email and Password required" });
    }

    // Restructure email and password from req body
    const { email, password } = req.body;

    try {
      // Find the user in database by email
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      
      // If user not found
      if (!user) {
        return res.status(404).send({ message: "Email or Password are incorrect" });
      }

      // Compares the password inputed by the user with the password in the database.
      const passwordMatch = await bcrypt.compare(password, user.password);

      // If password didn't matched
      if (!passwordMatch) {
        return res.status(401).send({ message: "Email or Password are incorrect" });
      }

      // Generate Jason Web Token (JWT)
      const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      }); 

      return res.status(200).send({ accessToken });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
}  

// Function to create financial record
async function createFinancialRecord(req, res) {
    console.log(req.body);
    // Check the required fields, except description
    if (!req.body.title) {
        return res.status(400).send({ message: "Title Required" });
    }
    if (!req.body.amount) {
        return res.status(400).send({ message: "Amount Required" });
    }
    if (!req.body.paymentMethod) {
        return res.status(400).send({ message: "Payment Method Required" });
    }
    if (!req.body.date) {
        return res.status(400).send({ message: "Date Required" });
    }
    if (!req.body.category) {
        return res.status(400).send({ message: "Category Required" });
    }

    //  Check the request from payment method field should be either "Credit", "Cash", "Debit", "Transfer", or "Qris"
    if (!['credit', 'cash', 'debit', 'transfer', 'qris'].includes(req.body.paymentMethod.toLowerCase())) {
        return res.status(400).send({ message: "Payment method must be either Credit, Cash, Debit, Transfer, or Qris"});
    }

    // Check the request from category field should be either "Income" or "Expense"
    if (!['income', 'expense'].includes(req.body.category.toLowerCase())) {
        return res.status(400).send({ message: "Category must be either Income or Expense" });
    }

    // Restructure all requests from req body
    const { title, amount, paymentMethod, date, category, description } = req.body;

    // Restructure userId from req user
    const { userId } = req.user;

    try {
        // Find payment method by type 
        const paymentMethodRecord = await prisma.paymentMethod.findFirst({
            where: {
                type: paymentMethod.toUpperCase()
            }
        });
        
        // If payment method not found
        if (!paymentMethodRecord) {
            return res.status(400).send({ message: "Invalid payment method" });
        }

        // Find category by type
        const categoryRecord = await prisma.category.findFirst({
            where: {
                type: category.toUpperCase()
            }
        });
        
        // If category not found
        if (!categoryRecord) {
            return res.status(400).send({ message: "Invalid category" });
        }

        // Create new records
        const newRecord = await prisma.financialRecords.create({
            data: {
                title,
                amount,
                paymentMethodId: paymentMethodRecord.id,  // Use the ID from PaymentMethod
                date,
                categoryId: categoryRecord.id,  // Use the ID from Category
                description,
                userId,
            },
        });

        res.status(201).send(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to create financial record" });
    }
}

// Function to read and get all financial records in database
async function getFinancialRecords(req, res) {
    // Read all financial records
    try {
        const records = await prisma.FinancialRecords.findMany();
        res.send(records);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

// Function to update financial record by id
async function updateFinancialRecord(req, res) {
    // Restructure all requests from req body
    const { title, amount, paymentMethod, date, category, description } = req.body;
    console.log(req.body);

    // Request the financial record id
    const { id } = req.params;

    try {
        // Find the financial record by id 
        const financialRecord = await prisma.FinancialRecords.findUnique ({
            where: { id: parseInt(id) },
        });

        // If financial record not found
        if (!financialRecord) {
            return res.status(400).json({ error: "Financial Records Not Found!"})
        }

        // Validate payment method if provided
        if (paymentMethod !== "") {
            if (!['credit', 'cash', 'debit', 'transfer', 'qris'].includes(paymentMethod.toLowerCase())) {
                return res.status(400).send({ message: "Payment method must be either Credit, Cash, Debit, Transfer, or Qris"});
            }
        }

        // Validate category if provided
        if (category !== "") {
            if (!['income', 'expense'].includes(category.toLowerCase())) {
                return res.status(400).send({ message: "Category must be either Income or Expense" });
            }
        } 

        // Find payment methode by type
        const paymentMethodRecord = await prisma.paymentMethod.findFirst({
            where: {
                type: paymentMethod ? { equals: paymentMethod.toUpperCase() } : {}
            }
        });

        // If payment method not found
        if (!paymentMethodRecord) {
            return res.status(400).send({ message: "Invalid payment method" });
        }

        // Find category by type
        const categoryRecord = await prisma.category.findFirst({
            where: {
                type: category ? { equals: category.toUpperCase() } : {}
            }
        });

        // If category not found
        if (!categoryRecord) {
            return res.status(400).send({ message: "Invalid category" });
        }

        // Update financial record by id
        const updatedFinancialRecord = await prisma.FinancialRecords.update({
            where: { id: parseInt(id) },
            data: {
                // Old data still remain if user inputs are empty
                title: title !== "" ? title : financialRecord.title,
                amount: amount !== "" ? amount : financialRecord.amount,
                paymentMethodId: paymentMethodRecord ? paymentMethodRecord.id : financialRecord.paymentMethodId,
                date: date ? new Date(date) : financialRecord.date,
                categoryId: categoryRecord ? categoryRecord.id : financialRecord.categoryId,
                description: description !== "" ? description : financialRecord.description,
            },
        });

        return res.status(200).json(updatedFinancialRecord);
    } catch (error) { 
        console.error(error);
        return res.status(500).json({ error: "Something went wrong while updating financial record"})
    }
}

// Function to delete financial record by id
async function deleteFinancialRecord(req, res) {
    // Request the financial record id
    const financialRecordId = parseInt(req.params.id);
    
    try {
        // Find the financial record by the requested id
        const financialRecord = await prisma.FinancialRecords.findUnique({
            where: { id: financialRecordId },
        });

        // If financial record not found
        if (!financialRecord) {
            return res.status(404).send({ message: "Financial Record Not Found" });
        }

        // Delete financial record from the database by id
        await prisma.FinancialRecords.delete({
            where: { id: financialRecordId },
        });

        res.send({ message: "Financial Record has been deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong while deleting financial record" });
    }
}

// Export all the modules
module.exports = {
    register,
    login,
    createFinancialRecord,
    getFinancialRecords,
    updateFinancialRecord,
    deleteFinancialRecord,
}