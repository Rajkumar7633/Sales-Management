import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sales from '../models/Sales.js';

// Load environment variables
dotenv.config();

// Validate required environment variable
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

class SalesService {
  constructor() {
    if (mongoose.connection.readyState !== 1) {
      mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }
  }

  async getFilteredSales({
    search = '',
    page = 1,
    sortBy = 'date',
    sortOrder = 'desc',
    regions = [],
    categories = [],
    paymentMethods = [],
    startDate,
    endDate,
    minAmount,
    maxAmount,
    limit = 10
  }) {
    try {
      const query = {};

      // Search functionality
      if (search) {
        query.$or = [
          { customerName: { $regex: search, $options: 'i' } },
          { productName: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by regions
      if (regions.length > 0) {
        query.region = { $in: regions };
      }

      // Filter by categories
      if (categories.length > 0) {
        query.category = { $in: categories };
      }

      // Filter by payment methods
      if (paymentMethods.length > 0) {
        query.paymentMethod = { $in: paymentMethods };
      }

      // Date range filter
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      // Amount range filter
      if (minAmount !== undefined || maxAmount !== undefined) {
        query.total = {};
        if (minAmount !== undefined) query.total.$gte = Number(minAmount);
        if (maxAmount !== undefined) query.total.$lte = Number(maxAmount);
      }

      // Sorting
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const [data, total] = await Promise.all([
        Sales.find(query)
          .sort(sortOptions)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Sales.countDocuments(query)
      ]);

      // Calculate aggregations
      const aggregations = await Sales.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$total' },
            totalItems: { $sum: '$quantity' },
            avgOrderValue: { $avg: '$total' }
          }
        }
      ]);

      return {
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit)
        },
        aggregations: aggregations[0] || {
          totalSales: 0,
          totalItems: 0,
          avgOrderValue: 0
        }
      };
    } catch (error) {
      console.error('Error in getFilteredSales:', error);
      throw error;
    }
  }

  async getFilterOptions() {
    try {
      const [regions, categories, paymentMethods] = await Promise.all([
        Sales.distinct('region'),
        Sales.distinct('category'),
        Sales.distinct('paymentMethod')
      ]);

      return {
        regions: regions.filter(Boolean).sort(),
        categories: categories.filter(Boolean).sort(),
        paymentMethods: paymentMethods.filter(Boolean).sort()
      };
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      throw error;
    }
  }

  async getSalesData() {
    try {
      return await Sales.find().limit(100).lean();
    } catch (error) {
      console.error('Error in getSalesData:', error);
      throw error;
    }
  }
}

// Export as a singleton
export default new SalesService();