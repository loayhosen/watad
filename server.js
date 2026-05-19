require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// ------------------- الاتصال بقاعدة البيانات (MongoDB Atlas) -------------------
// استخدم متغير البيئة أولاً، وإلا استخدم الرابط المباشر (لتسهيل النشر المباشر)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://wataduser:watad12345@watad.w2jcy9k.mongodb.net/watad_db?retryWrites=true&w=majority&appName=watad';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ تم الاتصال بـ MongoDB Atlas بنجاح');
    console.log('📁 قاعدة البيانات: watad_db');
  })
  .catch((err) => {
    console.error('❌ خطأ في الاتصال بـ MongoDB:', err.message);
    process.exit(1);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'خطأ في MongoDB:'));
db.once('open', () => console.log('✅ قاعدة البيانات جاهزة للاستخدام'));

// ------------------- تعريف النماذج (Models) -------------------
const projectSchema = new mongoose.Schema({
  name: String,
  createdAt: String,
  archived: Boolean,
});
const Project = mongoose.model('Project', projectSchema);

const categorySchema = new mongoose.Schema({
  name: String,
});
const Category = mongoose.model('Category', categorySchema);

const employeeSchema = new mongoose.Schema({
  fullName: String,
  jobTitle: String,
  baseSalary: Number,
  hireDate: String,
  categoryId: String,
  advanceBalance: Number,
  identity: String,
});
const Employee = mongoose.model('Employee', employeeSchema);

const transactionSchema = new mongoose.Schema({
  employeeId: String,
  type: String,
  amount: Number,
  reason: String,
  date: String,
  monthKey: String,
  createdAt: String,
});
const Transaction = mongoose.model('Transaction', transactionSchema);

const employeeMonthlyNoteSchema = new mongoose.Schema({
  employeeId: String,
  monthKey: String,
  note: String,
});
const EmployeeMonthlyNote = mongoose.model('EmployeeMonthlyNote', employeeMonthlyNoteSchema);

const purchaseSchema = new mongoose.Schema({
  projectId: String,
  date: String,
  monthKey: String,
  totalAmount: Number,
  paidAmount: Number,
  description: String,
  details: String,
  createdAt: String,
});
const Purchase = mongoose.model('Purchase', purchaseSchema);

const saleSchema = new mongoose.Schema({
  projectId: String,
  date: String,
  monthKey: String,
  totalAmount: Number,
  paidAmount: Number,
  description: String,
  details: String,
  createdAt: String,
});
const Sale = mongoose.model('Sale', saleSchema);

const expenseSchema = new mongoose.Schema({
  projectId: String,
  date: String,
  monthKey: String,
  amount: Number,
  description: String,
  category: String,
  details: String,
  createdAt: String,
});
const Expense = mongoose.model('Expense', expenseSchema);

const transportSchema = new mongoose.Schema({
  projectId: String,
  date: String,
  monthKey: String,
  amount: Number,
  customerName: String,
  details: String,
  createdAt: String,
});
const Transport = mongoose.model('Transport', transportSchema);

const projectExpenseSchema = new mongoose.Schema({
  projectId: String,
  date: String,
  monthKey: String,
  amount: Number,
  projectName: String,
  details: String,
  createdAt: String,
});
const ProjectExpense = mongoose.model('ProjectExpense', projectExpenseSchema);

const paymentSchema = new mongoose.Schema({
  parentId: String,
  type: String,
  amount: Number,
  date: String,
  note: String,
  isAdditional: Boolean,
  createdAt: String,
});
const Payment = mongoose.model('Payment', paymentSchema);

const mirrorSaleSchema = new mongoose.Schema({
  date: String,
  amount: Number,
  description: String,
  details: String,
  createdAt: String,
});
const MirrorSale = mongoose.model('MirrorSale', mirrorSaleSchema);

const mirrorPurchaseSchema = new mongoose.Schema({
  date: String,
  amount: Number,
  description: String,
  details: String,
  createdAt: String,
});
const MirrorPurchase = mongoose.model('MirrorPurchase', mirrorPurchaseSchema);

const mirrorCostSchema = new mongoose.Schema({
  date: String,
  amount: Number,
  description: String,
  details: String,
  createdAt: String,
});
const MirrorCost = mongoose.model('MirrorCost', mirrorCostSchema);

const assetSchema = new mongoose.Schema({
  name: String,
  type: String,
  serial: String,
  receiver: String,
  purchaseDate: String,
  purchaseValue: Number,
  notes: String,
  createdAt: String,
});
const Asset = mongoose.model('Asset', assetSchema);

const assetTransactionSchema = new mongoose.Schema({
  assetId: String,
  type: String,
  amount: Number,
  date: String,
  description: String,
  monthKey: String,
  createdAt: String,
});
const AssetTransaction = mongoose.model('AssetTransaction', assetTransactionSchema);

// ------------------- دوال مساعدة -------------------
function asString(value) {
  return value ? String(value) : value;
}

// ------------------- مسارات API (جميعها: GET, POST, PUT, DELETE لكل كيان) -------------------
// -- المشاريع
app.get('/api/projects', async (req, res) => { const items = await Project.find(); res.json(items); });
app.get('/api/projects/:id', async (req, res) => { const item = await Project.findById(req.params.id); res.json(item); });
app.post('/api/projects', async (req, res) => { const item = new Project(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/projects/:id', async (req, res) => { const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/projects/:id', async (req, res) => { await Project.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- الفئات
app.get('/api/categories', async (req, res) => { const items = await Category.find(); res.json(items); });
app.get('/api/categories/:id', async (req, res) => { const item = await Category.findById(req.params.id); res.json(item); });
app.post('/api/categories', async (req, res) => { const item = new Category(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/categories/:id', async (req, res) => { const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/categories/:id', async (req, res) => { await Category.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- الموظفون
app.get('/api/employees', async (req, res) => { const { categoryId } = req.query; const filter = categoryId ? { categoryId: asString(categoryId) } : {}; const items = await Employee.find(filter); res.json(items); });
app.get('/api/employees/:id', async (req, res) => { const item = await Employee.findById(req.params.id); res.json(item); });
app.post('/api/employees', async (req, res) => { const item = new Employee(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/employees/:id', async (req, res) => { const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/employees/:id', async (req, res) => { await Employee.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- المعاملات
app.get('/api/transactions', async (req, res) => { const { employeeId, monthKey } = req.query; let filter = {}; if (employeeId) filter.employeeId = asString(employeeId); if (monthKey) filter.monthKey = monthKey; const items = await Transaction.find(filter); res.json(items); });
app.get('/api/transactions/:id', async (req, res) => { const item = await Transaction.findById(req.params.id); res.json(item); });
app.post('/api/transactions', async (req, res) => { const item = new Transaction(req.body); const saved = await item.save(); res.json(saved); });
app.delete('/api/transactions/:id', async (req, res) => { await Transaction.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- ملاحظات الموظف الشهرية
app.get('/api/employee_monthly_notes', async (req, res) => { const { employeeId, monthKey } = req.query; let filter = {}; if (employeeId && monthKey) filter = { employeeId: asString(employeeId), monthKey }; const items = await EmployeeMonthlyNote.find(filter); res.json(items); });
app.get('/api/employee_monthly_notes/:id', async (req, res) => { const item = await EmployeeMonthlyNote.findById(req.params.id); res.json(item); });
app.post('/api/employee_monthly_notes', async (req, res) => { const item = new EmployeeMonthlyNote(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/employee_monthly_notes/:id', async (req, res) => { const updated = await EmployeeMonthlyNote.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });

// -- مشتريات
app.get('/api/purchases', async (req, res) => { const { projectId } = req.query; const filter = projectId ? { projectId: asString(projectId) } : {}; const items = await Purchase.find(filter); res.json(items); });
app.get('/api/purchases/:id', async (req, res) => { const item = await Purchase.findById(req.params.id); res.json(item); });
app.post('/api/purchases', async (req, res) => { const item = new Purchase(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/purchases/:id', async (req, res) => { const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/purchases/:id', async (req, res) => { await Purchase.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- مبيعات
app.get('/api/sales', async (req, res) => { const { projectId } = req.query; const filter = projectId ? { projectId: asString(projectId) } : {}; const items = await Sale.find(filter); res.json(items); });
app.get('/api/sales/:id', async (req, res) => { const item = await Sale.findById(req.params.id); res.json(item); });
app.post('/api/sales', async (req, res) => { const item = new Sale(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/sales/:id', async (req, res) => { const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/sales/:id', async (req, res) => { await Sale.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- مصاريف عامة
app.get('/api/expenses', async (req, res) => { const { projectId } = req.query; const filter = projectId ? { projectId: asString(projectId) } : {}; const items = await Expense.find(filter); res.json(items); });
app.get('/api/expenses/:id', async (req, res) => { const item = await Expense.findById(req.params.id); res.json(item); });
app.post('/api/expenses', async (req, res) => { const item = new Expense(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/expenses/:id', async (req, res) => { const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/expenses/:id', async (req, res) => { await Expense.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- مصاريف النقل
app.get('/api/transport', async (req, res) => { const { projectId } = req.query; const filter = projectId ? { projectId: asString(projectId) } : {}; const items = await Transport.find(filter); res.json(items); });
app.get('/api/transport/:id', async (req, res) => { const item = await Transport.findById(req.params.id); res.json(item); });
app.post('/api/transport', async (req, res) => { const item = new Transport(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/transport/:id', async (req, res) => { const updated = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/transport/:id', async (req, res) => { await Transport.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- مصاريف المشروع
app.get('/api/projectExpenses', async (req, res) => { const { projectId } = req.query; const filter = projectId ? { projectId: asString(projectId) } : {}; const items = await ProjectExpense.find(filter); res.json(items); });
app.get('/api/projectExpenses/:id', async (req, res) => { const item = await ProjectExpense.findById(req.params.id); res.json(item); });
app.post('/api/projectExpenses', async (req, res) => { const item = new ProjectExpense(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/projectExpenses/:id', async (req, res) => { const updated = await ProjectExpense.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/projectExpenses/:id', async (req, res) => { await ProjectExpense.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- الدفعات
app.get('/api/payments', async (req, res) => { const { parentId } = req.query; const filter = parentId ? { parentId: asString(parentId) } : {}; const items = await Payment.find(filter); res.json(items); });
app.get('/api/payments/:id', async (req, res) => { const item = await Payment.findById(req.params.id); res.json(item); });
app.post('/api/payments', async (req, res) => { const item = new Payment(req.body); const saved = await item.save(); res.json(saved); });
app.delete('/api/payments/:id', async (req, res) => { await Payment.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- المرايا
app.get('/api/mirror_sales', async (req, res) => { const items = await MirrorSale.find(); res.json(items); });
app.get('/api/mirror_sales/:id', async (req, res) => { const item = await MirrorSale.findById(req.params.id); res.json(item); });
app.post('/api/mirror_sales', async (req, res) => { const item = new MirrorSale(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/mirror_sales/:id', async (req, res) => { const updated = await MirrorSale.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/mirror_sales/:id', async (req, res) => { await MirrorSale.findByIdAndDelete(req.params.id); res.json({ success: true }); });

app.get('/api/mirror_purchases', async (req, res) => { const items = await MirrorPurchase.find(); res.json(items); });
app.get('/api/mirror_purchases/:id', async (req, res) => { const item = await MirrorPurchase.findById(req.params.id); res.json(item); });
app.post('/api/mirror_purchases', async (req, res) => { const item = new MirrorPurchase(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/mirror_purchases/:id', async (req, res) => { const updated = await MirrorPurchase.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/mirror_purchases/:id', async (req, res) => { await MirrorPurchase.findByIdAndDelete(req.params.id); res.json({ success: true }); });

app.get('/api/mirror_costs', async (req, res) => { const items = await MirrorCost.find(); res.json(items); });
app.get('/api/mirror_costs/:id', async (req, res) => { const item = await MirrorCost.findById(req.params.id); res.json(item); });
app.post('/api/mirror_costs', async (req, res) => { const item = new MirrorCost(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/mirror_costs/:id', async (req, res) => { const updated = await MirrorCost.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/mirror_costs/:id', async (req, res) => { await MirrorCost.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- الأصول
app.get('/api/assets', async (req, res) => { const items = await Asset.find(); res.json(items); });
app.get('/api/assets/:id', async (req, res) => { const item = await Asset.findById(req.params.id); res.json(item); });
app.post('/api/assets', async (req, res) => { const item = new Asset(req.body); const saved = await item.save(); res.json(saved); });
app.put('/api/assets/:id', async (req, res) => { const updated = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(updated); });
app.delete('/api/assets/:id', async (req, res) => { await Asset.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// -- معاملات الأصول
app.get('/api/asset_transactions', async (req, res) => { const { assetId, monthKey } = req.query; let filter = {}; if (assetId) filter.assetId = asString(assetId); if (monthKey) filter.monthKey = monthKey; const items = await AssetTransaction.find(filter); res.json(items); });
app.get('/api/asset_transactions/:id', async (req, res) => { const item = await AssetTransaction.findById(req.params.id); res.json(item); });
app.post('/api/asset_transactions', async (req, res) => { const item = new AssetTransaction(req.body); const saved = await item.save(); res.json(saved); });
app.delete('/api/asset_transactions/:id', async (req, res) => { await AssetTransaction.findByIdAndDelete(req.params.id); res.json({ success: true }); });

// ------------------- خدمة الملفات الثابتة -------------------
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ------------------- بدء الخادم -------------------
app.listen(PORT, HOST, () => {
  console.log(`🚀 الخادم يعمل على http://${HOST}:${PORT}`);
  console.log(`   محلياً: http://localhost:${PORT}`);
  console.log(`   على الشبكة: http://<IP>:${PORT}`);
});