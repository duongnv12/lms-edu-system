// client/src/stores/departmentStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as departmentService from '../services/departmentService';

export const useDepartmentStore = defineStore('department', () => {
    const departments = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchDepartments = async () => {
        loading.value = true;
        error.value = null;
        try {
            const res = await departmentService.getDepartments();
            departments.value = res.data;
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    return {
        departments,
        loading,
        error,
        fetchDepartments,
    };
});
