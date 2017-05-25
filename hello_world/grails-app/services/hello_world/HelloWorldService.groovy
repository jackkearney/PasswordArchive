package hello_world
import grails.transaction.Transactional

@Transactional
class HelloWorldService {

    def registerAccount(String username, String password) {
        Person user = Person.findByUsername(username)
        if (user != null)
            return false
        user = new Person(username: username, password: password)
        return user.save(failOnError: true, flush: true) != null
    }

    def editPasswordEntry(String id_str, String newAccountName, String newPassword, String url) {

        def id = id_str as Long
        def passEntry = PassEntry.get(id)
        if (newPassword != null)
            passEntry.password = newPassword
        if (newAccountName != null)
            passEntry.accountName = newAccountName
        // always change url
        passEntry.url = url
        return passEntry.save(failOnError: true, flush: true) != null
    }

    def addPasswordEntry(String username, String password, String accountName, String url) {
        if (username == null || password == null || accountName == null) {
            return false
        }
        // user not registered
        if (Person.findByUsername(username) == null)
            return false
        // post already exists for this user
        def current = PassEntry.findByUsernameAndAccountName(username, accountName)
        if (current != null) {
            return false
        }
        // create new post
        def passEntry = new PassEntry(username: username, password: password, accountName: accountName, url: url)
        return passEntry.save(flush: true) != null
    }

    def removePasswordEntry(int id) {

        id = id as Long
        def password = PassEntry.get(id)
        if (password == null)
            return false
        password.delete(flush: true)
        return true

    }

    def tryLogIn(String username, String password) {
        def person = Person.findByUsernameAndPassword(username, password)
        return person != null
    }
}
