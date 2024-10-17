// controllers/companyController.js
const updateCompanies = async (req, res) => {
    try {
        const { id, nombre, number } = req.body;
        
        // Get Redis client from request
        const redisClient = req.redisClient;

        // Get companies from Redis
        let companies = await redisClient.get('companies');
        companies = JSON.parse(companies) || [];

        // Check if the company exists
        let companyIndex = companies.findIndex(company => company.id === id);

        if (companyIndex > -1) {
            // Update the existing company
            companies[companyIndex].nombre = nombre;
            companies[companyIndex].number = number;
        } else {
            // Add a new company
            companies.push({ id, nombre, number });
        }

        // Save the updated companies back to Redis
        await redisClient.set('companies', JSON.stringify(companies));

        return res.status(200).json({
            message: 'Company list updated successfully',
            companies
        });
    } catch (error) {
        console.error('Error updating companies:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    updateCompanies
};