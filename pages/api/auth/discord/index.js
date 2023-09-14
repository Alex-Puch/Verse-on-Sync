export default async function handler(req, res) {

    var session = req.session;
    if(session.toString){
        res.send({msg: session.toString})
    }
    else{
        res.send(200);
    }

}