const permissionMiddleware = (req:any, res: any, next: any) => {
    if (req.user.role === 'admin') {
        next()
    }else {
        return res.end('403')
    }
}

export default permissionMiddleware;