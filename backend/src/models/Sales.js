// /backend/src/models/Sales.js
import { getDbPool } from '../db/mysql.js';

class Sales {
  constructor() {
    this.pool = getDbPool();
  }

  async getAll() {
    const [rows] = await this.pool.query('SELECT * FROM sales');
    return rows;
  }

  // Helper to parse array from query string
  parseArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Handle comma-separated values
      return value.split(',').map(v => v.trim()).filter(v => v);
    }
    return [];
  }

  // Helper to build WHERE conditions for filters
  buildWhereClause(filters, params) {
    let whereClause = 'WHERE 1=1';

    // Search filter (customer name or phone number)
    if (filters.search) {
      whereClause += ' AND (customerName LIKE ? OR phoneNumber LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Regions filter (multiple selection)
    const regions = this.parseArray(filters.regions);
    if (regions.length > 0) {
      whereClause += ` AND customerRegion IN (${regions.map(() => '?').join(',')})`;
      params.push(...regions);
    }

    // Genders filter (multiple selection)
    const genders = this.parseArray(filters.genders);
    if (genders.length > 0) {
      whereClause += ` AND gender IN (${genders.map(() => '?').join(',')})`;
      params.push(...genders);
    }

    // Age range filter
    if (filters.ageRange) {
      if (filters.ageRange === '56+') {
        whereClause += ' AND age >= 56';
      } else {
        const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
        whereClause += ' AND age >= ? AND age <= ?';
        params.push(minAge, maxAge);
      }
    }

    // Categories filter (multiple selection)
    const categories = this.parseArray(filters.categories);
    if (categories.length > 0) {
      whereClause += ` AND productCategory IN (${categories.map(() => '?').join(',')})`;
      params.push(...categories);
    }

    // Tags filter (multiple selection) - tags are comma-separated in the database
    const tags = this.parseArray(filters.tags);
    if (tags.length > 0) {
      // Use FIND_IN_SET or LIKE for comma-separated tags
      const tagConditions = tags.map(() => {
        return '(FIND_IN_SET(?, tags) > 0 OR tags LIKE ? OR tags = ?)';
      });
      whereClause += ` AND (${tagConditions.join(' OR ')})`;
      tags.forEach(tag => {
        params.push(tag, `%${tag}%`, tag);
      });
    }

    // Payment methods filter (multiple selection)
    const paymentMethods = this.parseArray(filters.paymentMethods);
    if (paymentMethods.length > 0) {
      whereClause += ` AND paymentMethod IN (${paymentMethods.map(() => '?').join(',')})`;
      params.push(...paymentMethods);
    }

    // Date range filter
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange.split(',');
      if (startDate && endDate) {
        whereClause += ' AND date >= ? AND date <= ?';
        params.push(startDate.trim(), endDate.trim());
      }
    }

    return whereClause;
  }

  async getFilteredSales({ 
    search = '', 
    page = 1, 
    limit = 10, 
    sortBy = 'date', 
    sortOrder = 'DESC',
    regions = [],
    genders = [],
    ageRange = '',
    categories = [],
    tags = [],
    paymentMethods = [],
    dateRange = ''
  }) {
    const offset = (page - 1) * limit;
    const params = [];
    
    // Build WHERE clause
    const whereClause = this.buildWhereClause({
      search,
      regions,
      genders,
      ageRange,
      categories,
      tags,
      paymentMethods,
      dateRange
    }, params);

    // Map frontend sortBy to database column names
    const sortColumnMap = {
      'date': 'date',
      'customerName': 'customerName',
      'quantity': 'quantity',
      'total': 'totalAmount',
      'final': 'finalAmount'
    };
    const dbSortColumn = sortColumnMap[sortBy] || 'date';
    const sortDirection = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    // Build query
    let query = `SELECT * FROM sales ${whereClause} ORDER BY ${dbSortColumn} ${sortDirection} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await this.pool.query(query, params);
    
    // Transform to match frontend expected format
    return rows.map(row => ({
      "Transaction ID": row.transactionId,
      "Date": row.date ? new Date(row.date).toISOString().split('T')[0] : null,
      "Customer ID": row.customerId,
      "Customer name": row.customerName,
      "Phone Number": row.phoneNumber,
      "Gender": row.gender,
      "Age": row.age,
      "Customer region": row.customerRegion,
      "Product ID": row.productId,
      "Product Category": row.productCategory,
      "Product Name": row.productName,
      "Brand": row.brand,
      "Quantity": row.quantity,
      "Price per Unit": row.pricePerUnit,
      "Total Amount": row.totalAmount,
      "Final Amount": row.finalAmount,
      "Discount Percentage": row.discountPercentage,
      "Payment Method": row.paymentMethod,
      "Tags": row.tags,
      "Employee name": row.employeeName,
      "Customer Type": row.customerType,
      "Order Status": row.orderStatus,
      "Delivery Type": row.deliveryType,
      "Store ID": row.storeId,
      "Store Location": row.storeLocation,
      "Salesperson ID": row.salespersonId,
    }));
  }

  async getCount(filters = {}) {
    const params = [];
    const whereClause = this.buildWhereClause(filters, params);
    
    const query = `SELECT COUNT(*) as total FROM sales ${whereClause}`;
    const [[{ total }]] = await this.pool.query(query, params);
    return total;
  }

  async getMetadata(filters = {}) {
    const params = [];
    const whereClause = this.buildWhereClause(filters, params);
    
    const query = `
      SELECT 
        SUM(quantity) as totalUnits,
        SUM(totalAmount) as totalAmount,
        SUM(totalAmount - finalAmount) as totalDiscount
      FROM sales ${whereClause}
    `;
    
    const [[result]] = await this.pool.query(query, params);
    return {
      totalUnits: result.totalUnits || 0,
      totalAmount: result.totalAmount || 0,
      totalDiscount: result.totalDiscount || 0,
    };
  }

  async getFilterOptions() {
    // Get distinct regions
    const [regions] = await this.pool.query(
      'SELECT DISTINCT customerRegion as name FROM sales WHERE customerRegion IS NOT NULL AND customerRegion != "" ORDER BY customerRegion'
    );
    
    // Get distinct genders
    const [genders] = await this.pool.query(
      'SELECT DISTINCT gender as name FROM sales WHERE gender IS NOT NULL AND gender != "" ORDER BY gender'
    );
    
    // Get distinct categories
    const [categories] = await this.pool.query(
      'SELECT DISTINCT productCategory as name FROM sales WHERE productCategory IS NOT NULL AND productCategory != "" ORDER BY productCategory'
    );
    
    // Get distinct payment methods
    const [paymentMethods] = await this.pool.query(
      'SELECT DISTINCT paymentMethod as name FROM sales WHERE paymentMethod IS NOT NULL AND paymentMethod != "" ORDER BY paymentMethod'
    );
    
    // Get all tags (they're comma-separated, so we need to extract them)
    const [tagRows] = await this.pool.query(
      'SELECT DISTINCT tags FROM sales WHERE tags IS NOT NULL AND tags != ""'
    );
    
    // Extract unique tags from comma-separated values
    const tagSet = new Set();
    tagRows.forEach(row => {
      if (row.tags) {
        row.tags.split(',').forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) tagSet.add(trimmed);
        });
      }
    });
    const tags = Array.from(tagSet).sort();
    
    // Age ranges are fixed
    const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56+'];
    
    return {
      regions: regions.map(r => r.name),
      genders: genders.map(g => g.name),
      ageRanges,
      categories: categories.map(c => c.name),
      tags,
      paymentMethods: paymentMethods.map(p => p.name)
    };
  }
}

export default new Sales();