import jwt from 'jsonwebtoken';

const generateToken = (id: string, role: string, storeId: string | null, isSuperAdmin: boolean = false) => {
    return jwt.sign({ id, role, storeId, isSuperAdmin }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

export default generateToken;
