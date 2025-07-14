import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Supply Chain Nodes (Suppliers, Warehouses, Stores)
export const nodes = sqliteTable('nodes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'supplier', 'warehouse', 'store', 'port'
  location: text('location').notNull(), // JSON string with lat/lng
  capacity: integer('capacity'),
  currentStock: integer('current_stock').default(0),
  riskLevel: text('risk_level').default('low'), // 'low', 'medium', 'high', 'critical'
  isActive: integer('is_active').default(1),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

// Supply Chain Edges (Routes between nodes)
export const edges = sqliteTable('edges', {
  id: text('id').primaryKey(),
  sourceId: text('source_id').notNull().references(() => nodes.id),
  targetId: text('target_id').notNull().references(() => nodes.id),
  routeType: text('route_type').notNull(), // 'road', 'sea', 'air', 'rail'
  distance: real('distance').notNull(),
  cost: real('cost').notNull(),
  duration: integer('duration').notNull(), // in hours
  capacity: integer('capacity'),
  currentLoad: integer('current_load').default(0),
  riskScore: real('risk_score').default(0),
  isActive: integer('is_active').default(1),
  metadata: text('metadata'), // JSON string
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

// Products/SKUs
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').unique().notNull(),
  category: text('category').notNull(),
  unitPrice: real('unit_price').notNull(),
  weight: real('weight'),
  volume: real('volume'),
  perishable: integer('perishable').default(0),
  demandVolatility: real('demand_volatility').default(0),
  metadata: text('metadata'), // JSON string
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

// Inventory levels at each node
export const inventory = sqliteTable('inventory', {
  id: text('id').primaryKey(),
  nodeId: text('node_id').notNull().references(() => nodes.id),
  productId: text('product_id').notNull().references(() => products.id),
  currentStock: integer('current_stock').notNull(),
  maxCapacity: integer('max_capacity').notNull(),
  reorderPoint: integer('reorder_point').notNull(),
  safetyStock: integer('safety_stock').notNull(),
  lastRestocked: text('last_restocked'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

// Disruption events
export const disruptions = sqliteTable('disruptions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // 'weather', 'traffic', 'port_strike', 'supplier_issue'
  severity: text('severity').notNull(), // 'low', 'medium', 'high', 'critical'
  affectedNodes: text('affected_nodes'), // JSON array of node IDs
  affectedRoutes: text('affected_routes'), // JSON array of edge IDs
  startTime: text('start_time').notNull(),
  endTime: text('end_time'),
  predictedEndTime: text('predicted_end_time'),
  impactScore: real('impact_score').default(0),
  status: text('status').default('active'), // 'active', 'resolved', 'monitoring'
  source: text('source'), // 'weather_api', 'news', 'manual', 'ai_prediction'
  metadata: text('metadata'), // JSON string
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

// Demand forecasts
export const forecasts = sqliteTable('forecasts', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id),
  nodeId: text('node_id').notNull().references(() => nodes.id),
  forecastDate: text('forecast_date').notNull(),
  predictedDemand: integer('predicted_demand').notNull(),
  confidenceInterval: text('confidence_interval'), // JSON with upper/lower bounds
  actualDemand: integer('actual_demand'), // filled after the date
  accuracy: real('accuracy'), // calculated after actual demand is known
  modelUsed: text('model_used').notNull(), // 'prophet', 'arima', 'neural_network'
  features: text('features'), // JSON string of features used
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

// Chat conversations
export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id'), // optional user tracking
  title: text('title'),
  messages: text('messages'), // JSON array of messages
  context: text('context'), // JSON string with supply chain context
  isActive: integer('is_active').default(1),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

// Analysis results cache
export const analysisResults = sqliteTable('analysis_results', {
  id: text('id').primaryKey(),
  analysisType: text('analysis_type').notNull(), // 'network', 'disruption', 'demand'
  inputHash: text('input_hash').notNull(), // hash of input data for caching
  result: text('result').notNull(), // JSON string of analysis result
  confidence: real('confidence'),
  executionTime: integer('execution_time'), // in milliseconds
  expiresAt: text('expires_at'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

// Performance metrics
export const metrics = sqliteTable('metrics', {
  id: text('id').primaryKey(),
  metricType: text('metric_type').notNull(), // 'throughput', 'latency', 'cost', 'quality'
  value: real('value').notNull(),
  unit: text('unit').notNull(),
  timestamp: text('timestamp').notNull(),
  nodeId: text('node_id').references(() => nodes.id),
  metadata: text('metadata'), // JSON string
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})