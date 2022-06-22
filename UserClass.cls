public with sharing class UserClass {
    public UserClass() {

    }
    @AuraEnabled(cacheable=true)
    public static List<User> getDetails(){
        List<User> lstUsr = new List<User>();
        lstUsr = [SELECT
        Name,
        Title,
        Phone,
        Email,
        FullPhotoUrl
        FROM User
        WITH SECURITY_ENFORCED
        LIMIT 10
        ];

        return lstUsr;
    }
    @AuraEnabled(cacheable=true)
    public static List<User> getInfo(String key){
        String searchkey='%'+key+'%';
        System.debug('## searchKey'+searchKey);
        return[
            SELECT id,Name,Email,Phone
                            FROM User
                            WHERE Name LIKE : searchkey];
        
    }
}
