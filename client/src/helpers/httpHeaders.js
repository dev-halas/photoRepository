export const loginHeader = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

const userToken = `Bearer ${localStorage.getItem('userToken')}`;
export const userAuthHeader = {
    headers: {
        Authorization: userToken,
        'Content-Type': 'multipart/form-data',
    },
};

const guestToken = `Bearer ${localStorage.getItem('guestToken')}`;
export const guestAuthHeader = {
    headers: {
        authorization: guestToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};
