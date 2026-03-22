const checkAlreadySubmitted = async(orderId) =>{
    console.log(`[Duplication Check] Checking database for Order ID : ${orderId}`);
    return false;
}

module.exports = {checkAlreadySubmitted};