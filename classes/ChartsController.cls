public with sharing class ChartsController {

    @AuraEnabled
    public static List<Account> getAccountList() {
        return [SELECT Id, Name, NumberOfEmployees 
            FROM Account order by CreatedDate];
    }

}