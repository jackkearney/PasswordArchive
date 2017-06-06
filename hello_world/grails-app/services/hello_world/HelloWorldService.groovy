package hello_world
import grails.transaction.Transactional
import org.codehaus.groovy.grails.validation.routines.UrlValidator

@Transactional
class HelloWorldService {


    def getData(String username) {
        if (username)
            return PassEntry.findAllByUsername((String) username)
        else
            throw new Throwable("Tried to access data with null username.")
    }

    def registerAccount(Object req) {
        def username = (String) req["username"]
        def password = (String) req["password"]
        if (checkUsernameTaken(username)) {
            return false
        } else {
            def user = new Person(username: username, password: password)
            if (user.save(failOnError: true, flush: true) == null)
                throw new Throwable("Failed to save")
            else
                return true
        }
    }

    def checkUsernameTaken(String username) {
        Person user = Person.findByUsername(username)
        return user != null
    }

    def editPasswordEntry(Object req) {
        def newAccountName = (String) req["accountName"]
        def newPassword = (String) req["password"]
        def url = (String) req["url"]

        // Edge case where JSON null gets around usual null check.
        // Need to use .equals to catch it.
        url = !(url.equals(null)||url.equals("null"))?url:""
        def urlAlias = !(url.equals(null)||url.equals("null"))?req["urlAlias"]:""

        def id = req["id"] as Long

        def passEntry = PassEntry.get(id)
        if (newPassword)
            passEntry.password = newPassword
        if (newAccountName)
            passEntry.accountName = newAccountName

        passEntry.url = url
        passEntry.urlAlias = urlAlias
        return passEntry.save(failOnError: true, flush: true) != null
    }

    def addPasswordEntry(Object req) {
        def accountName = (String) req["accountName"]
        def password = (String) req["password"]
        def username = (String) req["username"]
        def url = (String) req["url"]
        def urlAlias = (String) req["urlAlias"]

        if (username == null || password == null || accountName == null)
            throw new Throwable("Some input was null.")

        if (Person.findByUsername(username) == null)
            throw new Throwable("User not registered.")

        // post already exists for this user
        def current = PassEntry.findByUsernameAndAccountName(username, accountName)

        if (current)
            return false

        // create new post
        def passEntry = new PassEntry(username: username, password: password,
                accountName: accountName, url: url, urlAlias: urlAlias)
        return passEntry.save(flush: true) != null
    }

    def removePasswordEntry(Object req) {
        def id = req["id"] as Long
        def password = PassEntry.get(id)
        if (password == null)
            return false
        password.delete(flush: true)
        return true

    }

    def tryLogIn(Object req) {
        def username = (String) req["username"]
        def password = (String) req["password"]
        def person = Person.findByUsernameAndPassword(username, password)
        return person != null
    }

    def checkUrl(String url) {
        try {
            UrlValidator urlValidator = new UrlValidator(UrlValidator.ALLOW_ALL_SCHEMES +
                    UrlValidator.ALLOW_2_SLASHES + UrlValidator.NO_FRAGMENTS)
            return urlValidator.isValid(url)
        } catch (Throwable e) {
            log.error(e)
            return false
        }
    }
}
