export interface OfferData {  
    offer: {  
        type: string;  // 'offer'  
        sdp: string;   // Session Description Protocol  
    };  
    to: string;  
    from: string;  
}  

export interface AnswerData {  
    answer: {  
        type: string;  // 'answer'  
        sdp: string;  
    };  
    to: string;  
    from: string;  
}  

export interface IceCandidateData {  
    candidate: {  
        candidate: string;         // 후보 스트링  
    };  
    to: string;  
    from: string;  
}