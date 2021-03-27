const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2',
    accessKeyId:'AKIAZ3SS2PVMGLSI2MMF',
    secretAccessKey:'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'
});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05',});
const queueUrl= "https://sqs.us-east-2.amazonaws.com/677704793432/test.fifo";


class ConsumerController{

    static async receiveMessageFromSqs(req,res){
    
        console.log('Inside the receive message for test');
        //get queue details
        let totalMessageCount=await ConsumerController.getQueueDetail();

        console.log('Total Message >>>>>>>',totalMessageCount);
    
        // return;
        if(totalMessageCount>0){
        
            //receive message
            let receivedMessageList=await ConsumerController.receiveMessageFromQueue();
            // console.log('Recive Message List >>>>>>>',receivedMessageList);

            if(receivedMessageList){

                console.log('Received Message List >>>>>>>>>>>>>>>>');
                console.log(receivedMessageList);
                //deliting received message
                for(let messageIndex=0;messageIndex<receivedMessageList.length;messageIndex++){

                    let message=receivedMessageList[messageIndex]
                    // console.log('Message Details >>>>>',message);
                    var deleteParams = {
                        QueueUrl: queueUrl,
                        ReceiptHandle: message.ReceiptHandle
                    };
                    //deleting message
                    let data= await sqs.deleteMessage(deleteParams).promise();
                    console.log('Message Deleted >>>>>>>');
                    console.log(data)

                }
                // res.status(200).json({ data:'Message Executed successfully !!!'})
                console.log('Method will call the receive message!!!');
                //do check again to receive message
                ConsumerController.receiveMessageFromSqs(req,res);
        
            }else{
                console.log('Receive Messagelist in else statement',receivedMessageList);
            }
        
        }else{
            console.log('Inside Else statement after submitting >>>>',totalMessageCount)
            res.status(200).json({data:'All the message received and deleted successfully!'});
        }
        

    }
    
    //getting the total number of messages from the queue
    static async getQueueDetail(){
                     
        var params = {
            QueueUrl: queueUrl,
            AttributeNames:[
                'All'
            ]
        };
            
        let data=await sqs.getQueueAttributes(params).promise();
        // console.log('Data details',data)
        
        if(data && data.Attributes){
            //getting total number of message in the queue
            let {ApproximateNumberOfMessages}=data.Attributes;
            return ApproximateNumberOfMessages;
        }

    }

    static async receiveMessageFromQueue(){
        
        var receiveMessageParams = {
            AttributeNames: [
                "SentTimestamp"
            ],
            MaxNumberOfMessages: 10, //defining the number of message 
            MessageAttributeNames: [
                "All"
            ],
            QueueUrl: queueUrl,
            VisibilityTimeout: 30,  
            WaitTimeSeconds: 10 ,//for long polling 
        
        };

        let data=await sqs.receiveMessage(receiveMessageParams).promise();
        if(data && data.Messages){
            return data.Messages;
        }
        
    }

}

module.exports=ConsumerController;