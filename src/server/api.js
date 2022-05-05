const axios = require('axios').default;
const {sendGasToken, CONFIG} = require("./eth");
const Web3 = require("web3");

var router = require('express').Router();

router.get('/howmuch', (req, res) => {
    res.json({
        "dropSize": CONFIG.DROP_SIZE
    });
});

router.get('/assetid', (req, res) => {
    res.json({
        "assetId": CONFIG.ASSET_ID
    });
});

router.post('/token', (req, res) => {
    let address = req.body["address"];
    let captchaResponse = req.body["g-recaptcha-response"];

    // Return error if captcha doesnt exist
    if(!captchaResponse){
        res.json({
            status: 'error',
            message: 'Invalid Captcha'
        });
        return;
    }

    let params = new URLSearchParams();
    params.append('secret', CONFIG.CAPTCHA_SECRET);
    params.append('response', captchaResponse);

    // Verify Captcha
    axios({
        method: 'post',
        url: "https://www.google.com/recaptcha/api/siteverify",
        data: params,
    }).then( async (axios_res) => {
        // console.log(axios_res.data);
        let data = axios_res.data;
        // If captcha succesfull send tx
        if(data.success){

            if(Web3.utils.isAddress(address)){
                try{
                    let receipt = await sendGasToken(address);
                    onsuccess(res, receipt.transactionHash);
                }catch(e){
                    console.log(e);
                    res.json({
                        status: 'error',
                        message: 'Failed to send transaction.'
                    });
                }
            }else{
                res.json({
                    status: 'error',
                    message: 'Invalid Address'
                });
            }
        }else{
            res.json({
                status: 'error',
                message: 'Invalid Captcha'
            });
        }
    });
});


function onsuccess(res, txHash){
    res.json({
        status: 'success',
        message: txHash
    });
}


module.exports = router;
