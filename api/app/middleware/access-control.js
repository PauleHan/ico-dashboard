import authenticate from './authenticate';

export default async function accessControl(req, res, next) {
  await authenticate(req, res, (err) => {
    if (err || !req.currentUser) {
      res.sendStatus(403);
      return;
    }
    next();
  });
}
