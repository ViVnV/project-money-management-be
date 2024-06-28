const { PrismaClient } = require('@prisma/cleint');
const { get } = require('./routes');
const prisma = new PrismaClient();

async function createFinancialRecords(req, res) {
    // Checking the requirement except description
    if (!req.body.title) {
        return res.status(400).send({ message: "Title Required" });
    }
    if (!req.body.amount) {
        return res.status(400).send({ message: "Amount Required" });
    }
    if (!req.body.date) {
        return res.status(400).send({ message: "Date Required" });
    }
    if (!req.body.category) {
        return res.status(400).send({ message: "Category Required" });
    }

    const { title, amount, date, category, description } = req.body;

    try {
        const newRecord = await prisma.FinancialRecords.create({
            data: {
                title,
                amount,
                date,
                category,
                description,
            },
        });

        res.status(201).send(newRecords);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to create financial records" });
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

async function updateFinancialRecords(req, res) {
    const { newTitle, amount, date, category, description } = req.body;

    try {
        const financialRecord = await prisma.FinancialRecords.findUnique ({
            where: { title: title},
        });

        if (!financialRecord) {
            return res.status(400).json({ error: "Financial Records Not Found!"})
        }

        const updatedFinancialRecord = await prisma.FinancialRecords.update({
            where: { title: title },
            data: {
                title: newTitle || title,
                amount: amount !== undefined ? amount : financialRecord.amount,
                date: date ? new Date(date) : financialRecord.date,
                category: category !== undefined ? category : financialRecord.category,
                description: description !== undefined ? description : financialRecord.description,
            },
        });

        return res.status(200).json(updatedFinancialRecords);
    } catch (error) { 
        console.error("Error updating financial record:", error);
        return res.status(500).json({ error: "Something went wrong while updating financial record"})
    }
}

async function deleteFinancialRecords(req, res) {
    const financialRecordId = parseInt(req.params.id);
    
    try {
        const financialRecord = await prisma.FinancialRecords.findUnique({
            where: { id: financialRecordId },
        });

        if (!financialRecord) {
            return res.status(404).send({ message: "Financial Record Not Found" });
        }

        await prisma.book.delete({
            where: { id: financialRecordId },
        });

        res.send({ message: "Financial Record has been deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong while deleting financial record" });
    }
}

module.exports = {
    createFinancialRecords,
    getFinancialRecords,
    updateFinancialRecords,
    deleteFinancialRecords,
}