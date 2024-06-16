const { PrismaClient } = require('@prisma/cleint');
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
        res.status(500).send({ message: "Failed to create financial records"});
    }
}