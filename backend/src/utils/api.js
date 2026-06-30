export class ApiError extends Error{constructor(status,message,details){super(message);this.status=status;this.details=details;}}
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const send=(res,data,status=200)=>res.status(status).json({success:true,data});
export const pageParams=req=>({page:Math.max(Number(req.query.page)||1,1),limit:Math.min(Math.max(Number(req.query.limit)||20,1),100),sort:req.query.sort||'-createdAt'});
