import {defineConfig} from 'vite'
import eslint from 'vite-plugin-eslint'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
//    base:"/compare-figures/"
})
