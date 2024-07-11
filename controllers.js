const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createFinancialRecord(req, res) {
    console.log(req.body);
    // Checking the requirement except description
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

    if (!['credit', 'cash', 'debit', 'transfer', 'qris'].includes(req.body.paymentMethod.toLowerCase())) {
        return res.status(400).send({ message: "Payment method must be either Credit, Cash, Debit, Transfer, or Qris"});
    }

    if (!['income', 'expense'].includes(req.body.category.toLowerCase())) {
        return res.status(400).send({ message: "Category must be either Income or Expense" });
    }

    const { title, amount, paymentMethod, date, category, description } = req.body;

    try {
        // Database lookup with case-insensitive comparison (optional)
        const foundPaymentMethod = await prisma.paymentMethod.findFirst({
          where: {
            type: {
              equals: paymentMethod.toUpperCase(), // Maintain case for lookup
            }
          }
        });
    
        if (!foundPaymentMethod) {
          return res.status(404).send({ message: "Payment method not found" });
        }
    
        const foundCategory = await prisma.category.findFirst({
          where: {
            type: {
              equals: category.toUpperCase(), // Maintain case for lookup
            }
          }
        });
    
        if (!foundCategory) {
          return res.status(404).send({ message: "Category not found" });
        }
    
        // Create new record
        const newRecord = await prisma.financialRecords.create({
          data: {
            title,
            amount,
            date,
            description,
            categoryId: foundCategory.id,
            paymentMethodId: foundPaymentMethod.id,
            userId: req.user.id, // Sesuaikan dengan cara kamu mengidentifikasi user
          },
        });
    
        res.status(201).send(newRecord);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to create financial record" });
      }
    }

async function getFinancialRecords(req, res) {
    // Read all financial records
    try {
        const records = await prisma.FinancialRecords.findMany();
        res.send(records);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

async function updateFinancialRecord(req, res) {
    const { title, amount, date, category, description } = req.body;
    const { id } = req.params;

        // Checking the requirement except description
        if (!req.body.title) {
            return res.status(400).send({ message: "Title Required" });
        }
        if (!req.body.amount) {
            return res.status(400).send({ message: "Amount Required" });
        }
        if (!req.body.paymentmethod) {
            return res.status(400).send({ message: "Payment Method Required" });
        }
        if (!req.body.date) {
            return res.status(400).send({ message: "Date Required" });
        }
        if (!req.body.category) {
            return res.status(400).send({ message: "Category Required" });
        }

    try {
        const financialRecord = await prisma.FinancialRecords.findUnique ({
            where: { id: parseInt(id) },
        });

        if (!financialRecord) {
            return res.status(400).json({ error: "Financial Records Not Found!"})
        }

        const updatedFinancialRecord = await prisma.FinancialRecords.update({
            where: { id: parseInt(id) },
            data: {
                title: title !== undefined ? title : financialRecord.title,
                amount: amount !== undefined ? amount : financialRecord.amount,
                paymentmethod: paymentmethod !== undefined ? paymentmethod : financialRecord.paymentmethod,
                date: date ? new Date(date) : financialRecord.date,
                category: category !== undefined ? category : financialRecord.category,
                description: description !== undefined ? description : financialRecord.description,
            },
        });

        return res.status(200).json(updatedFinancialRecord);
    } catch (error) { 
        console.error("Error updating financial record:", error);
        return res.status(500).json({ error: "Something went wrong while updating financial record"})
    }
}

async function deleteFinancialRecord(req, res) {
    const financialRecordId = parseInt(req.params.id);
    
    try {
        const financialRecord = await prisma.FinancialRecords.findUnique({
            where: { id: financialRecordId },
        });

        if (!financialRecord) {
            return res.status(404).send({ message: "Financial Record Not Found" });
        }

        await prisma.FinancialRecords.delete({
            where: { id: financialRecordId },
        });

        res.send({ message: "Financial Record has been deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong while deleting financial record" });
    }
}

module.exports = {
    createFinancialRecord,
    getFinancialRecords,
    updateFinancialRecord,
    deleteFinancialRecord,
}