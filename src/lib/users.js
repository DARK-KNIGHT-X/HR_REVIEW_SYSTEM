// Hardcoded users — assignment me auth system ki zaroorat nahi hai,
// isliye seedhe yahan list bana diya hai.

export const MANAGER = {
  username: "manager",
  password: "crystal123",
  name: "Ananya Verma",
  role: "manager",
};

export const EMPLOYEES = [
  { id: "EMP01", username: "emp01", password: "crystal123", name: "Rohan Mehta", role: "employee" },
  { id: "EMP02", username: "emp02", password: "crystal123", name: "Kavya Nair", role: "employee" },
  { id: "EMP03", username: "emp03", password: "crystal123", name: "Aditya Rao", role: "employee" },
  { id: "EMP04", username: "emp04", password: "crystal123", name: "Simran Kaur", role: "employee" },
  { id: "EMP05", username: "emp05", password: "crystal123", name: "Vikram Joshi", role: "employee" },
  { id: "EMP06", username: "emp06", password: "crystal123", name: "Neha Gupta", role: "employee" },
  { id: "EMP07", username: "emp07", password: "crystal123", name: "Arjun Reddy", role: "employee" },
  { id: "EMP08", username: "emp08", password: "crystal123", name: "Pooja Iyer", role: "employee" },
  { id: "EMP09", username: "emp09", password: "crystal123", name: "Karan Malhotra", role: "employee" },
  { id: "EMP10", username: "emp10", password: "crystal123", name: "Divya Pillai", role: "employee" },
  { id: "EMP11", username: "emp11", password: "crystal123", name: "Sahil Khan", role: "employee" },
  { id: "EMP12", username: "emp12", password: "crystal123", name: "Ritu Chawla", role: "employee" },
  { id: "EMP13", username: "emp13", password: "crystal123", name: "Yash Patel", role: "employee" },
  { id: "EMP14", username: "emp14", password: "crystal123", name: "Ananya Singh", role: "employee" },
  { id: "EMP15", username: "emp15", password: "crystal123", name: "Manish Kumar", role: "employee" },
  { id: "EMP16", username: "emp16", password: "crystal123", name: "Tanvi Desai", role: "employee" },
  { id: "EMP17", username: "emp17", password: "crystal123", name: "Rahul Bose", role: "employee" },
  { id: "EMP18", username: "emp18", password: "crystal123", name: "Priyanka Das", role: "employee" },
  { id: "EMP19", username: "emp19", password: "crystal123", name: "Vivek Menon", role: "employee" },
  { id: "EMP20", username: "emp20", password: "crystal123", name: "Shreya Kapoor", role: "employee" },
];

// Login check karne wala function.
// Pehle dekhta hai ki manager hai ya nahi, phir employees list me dhundta hai.
export function findUser(username, password) {
  if (username === MANAGER.username && password === MANAGER.password) {
    return MANAGER;
  }

  for (let i = 0; i < EMPLOYEES.length; i++) {
    const emp = EMPLOYEES[i];
    if (emp.username === username && emp.password === password) {
      return emp;
    }
  }

  return null; // koi match nahi mila
}