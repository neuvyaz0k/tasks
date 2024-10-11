import axios from 'axios';

token = ""

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginUser = async (userData) => {
    return await api.post('/login', userData);
};

export const registerUser = async (userData) => {

    try {
        const response = await axios.post('http://localhost:3000/register', userData);
        console.log('Регистрация успешна!', response.data);
        token = response.data.token;

    } catch (error) {
        if (error.response) {
            console.error('Ошибка регистрации:', error.response.data.message);
        } else {
            console.error('Ошибка сети:', error.message);
        }
    }
}

export const getBoardData = async () => {
    try {
      const response = await api.get('/board', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Возвращаем данные доски
    } catch (error) {
      console.error('Ошибка при получении данных доски:', error);
      throw error; // Бросаем ошибку для обработки в компоненте
    }
  };


  // Выход из аккаунта
export const logoutUser = () => {
    localStorage.removeItem('token'); // Удаляем токен из локального хранилища
};

// Обновление данных доски задач
export const updateBoard = async (boardId, boardData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/boards/${boardId}`, boardData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data || 'Ошибка обновления доски');
    }
};

// Редактирование данных профиля
export const updateProfile = async (username, password) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/profile`, { username, password }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data || 'Ошибка обновления профиля');
    }
};

// Добавление новой доски
export const createBoard = async (boardData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/boards`, boardData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data || 'Ошибка создания доски');
    }
};
