document.addEventListener('alpine:init', () => {
    
    Alpine.data('totalPrices', () => {

		return {

            planName: "",
            smsPrice: 0.00,
            callPrice: 0.00,
            id: 0,
            pricePlan: [],
            selectedPlanName: "",
            actions: "",
            totalBill: 0.00,
            newName: "",
            newCall: 0.00,
            newSms: 0.00,
            createMessage: "",
            updateMessage: "",
            deleteMessage: "",
         

            init(){
                this.getPricePlan();
                
            },

            getPricePlan() {
                const getPricePlanURL = `http://localhost:4011/api/price_plans`
                return axios.get(getPricePlanURL)
                .then(result => {
                    this.pricePlan = result.data.getPlan;
                    
                })
                .catch(error => {
                    console.error(error);
                });
                
            },

               createPricePlan() {
                return axios.post('http://localhost:4011/api/price_plan/create', {
                    "plan_name": this.newName,
                    "call_price": this.newCall,
                    "sms_price": this.newSms
                    
                }).then(result => {
                    this.pricePlan = result.data.createPricePlan;
                    this.createMessage = result.data.message;

                    setTimeout(() => {
                        this.createMessage = '';
                        window.location.reload();
                    }, 3000)
                    
                })
            },

              updatePricePlan() {
                return axios.post('http://localhost:4011/api/price_plan/update', {
                    "plan_name": this.planName,
                    "call_price" : this.callPrice,
                    "sms_price": this.smsPrice,
                }).then((result) => {
                    this.pricePlan = result.data.updatePricePlan;
                    this.updateMessage = result.data.message;

                    setTimeout(() => {
                        this.updateMessage = '';
                        window.location.reload();
                    }, 3000)
               
                })

            },

            deletePricePlan(id) {
                return axios.post('http://localhost:4011/api/price_plan/delete', {
                    "id":this.id,
                }).then(result => {
                   
                    this.deleteMessage = result.data.message;

                    setTimeout(() => {
                        this.deleteMessage = '';
                        window.location.reload();
                    }, 3000)
                   


                });
               
            },


            calculatePhoneBill() {
                return axios.post('http://localhost:4011/api/phonebill',{
                    "price_plan": this.selectedPlanName,
                    "actions" : this.actions,
                }).then(result => {
                    this.totalBill = result.data.total;
                    

                    setTimeout(() => {
                        this.totalBill = 0.00;
                        window.location.reload();
                    }, 9000)
                    
                })
                .catch(error => {
                    console.error(error);
                    this.totalBill = 0.00;
                })
            }

        }

    })

});