import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd())
const filesToVerify = [
  'src/services/AddEditDoctors.jsx',
  'src/services/AddEditPatients.jsx',
  'src/services/AddEditPrescriptions.jsx',
  'src/services/AddEditVisits.jsx',
  'src/services/AddEditBills.jsx',
  'src/pages/auth/Register.jsx',
]

for (const relativePath of filesToVerify) {
  const absolutePath = path.join(root, relativePath)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing file: ${relativePath}`)
  }
}

console.log('verified files:', filesToVerify.join(', '))
