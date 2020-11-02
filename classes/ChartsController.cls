public with sharing class ChartsController {

    @AuraEnabled
    public static List<Account> getAccountList(String query) {
        return Database.query(query);
    }

}