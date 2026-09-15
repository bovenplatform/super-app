export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-500 text-sm font-medium">Total Pengguna</h3>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
      </div>
    </div>
  );
}
