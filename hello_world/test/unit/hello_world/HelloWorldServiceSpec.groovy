package hello_world

import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(HelloWorldService)
@Mock([Person, PassEntry])
class HelloWorldServiceSpec extends Specification {

    def setup() {
        def myPerson = new Person(username: 'test user',password: 'test pass')
        myPerson.save(validate: false, flush: true)
        def myPassEntry = new PassEntry(username: 'test user', password: 'test pass', accountName: 'test accountName')
        myPassEntry.save(validate: false, flush: true)
        def myPassEntry2 = new PassEntry(username: 'test use2', password: 'test pass2', accountName: 'some accountName')
        myPassEntry2.save(validate: false, flush: true)
    }

    def cleanup() {
    }

    void "test registerAccount null username"() {
        given:
        def username = null
        def password = "password"
        when:
        service.registerAccount(username,password)
        then:
        thrown RuntimeException
    }

    void "test registerAccount null password"() {
        given:
        def username = "username"
        def password = null
        when:
        service.registerAccount(username,password)
        then:
        thrown RuntimeException
    }

    void "test registerAccount user already registered"() {
        given:
        def username = "test user"
        def password = "test pass"
        when:
        def result = service.registerAccount(username,password)
        then:
        assertFalse result
    }

    void "test registerAccount user not yet registered"() {
        given:
        def username = "new user"
        def password = "test pass"
        when:
        def result = service.registerAccount(username,password)
        then:
        assertTrue result
    }

    void "test tryLogIn null username"() {
        given:
        def username = null
        def password = "password"
        when:
        def result = service.tryLogIn(username,password)
        then:
        assertFalse result
    }

    void "test tryLogIn null password"() {
        given:
        def username = "username"
        def password = null
        when:
        def result = service.tryLogIn(username,password)
        then:
        assertFalse result
    }

    void "test tryLogIn user already registered"() {
        given:
        def username = "test user"
        def password = "test pass"
        when:
        def result = service.tryLogIn(username,password)
        then:
        assertTrue result
    }

    void "test tryLogIn user not yet registered"() {
        given:
        def username = "new user"
        def password = "test pass"
        when:
        def result = service.tryLogIn(username,password)
        then:
        assertFalse result
    }

    void "test addPasswordEntry null username"() {
        given:
        def url = ""
        def username = null
        def password = "test pass"
        def accountName = "test accountName"
        when:
        def result = service.addPasswordEntry(username,password,accountName, url)
        then:
        assertFalse result
    }

    void "test addPasswordEntry null password"() {
        given:
        def url = ""
        def username = "test user"
        def password = null
        def accountName = "test accountName"
        when:
        def result = service.addPasswordEntry(username,password,accountName, url)
        then:
        assertFalse result
    }

    void "test addPasswordEntry null accountName"() {
        given:
        def url = ""
        def username = 'test user'
        def password = "test pass"
        def accountName = null
        when:
        def result = service.addPasswordEntry(username,password,accountName, url)
        then:
        assertFalse result
    }

    void "test addPasswordEntry duplicate accountName" () {
        given:
        def url = ""
        def username = "test user"
        def password = "test pass"
        def accountName = "test accountName"
        when:
        def result = service.addPasswordEntry(username,password,accountName, url)
        then:
        assertFalse result
    }

    void "test addPasswordEntry user not yet registered"() {
        given:
        def url = ""
        def username = "new user"
        def password = "test pass"
        def accountName = "test accountName"
        when:
        def result = service.addPasswordEntry(username,password,accountName, url)
        then:
        assertFalse result
    }

    void "test addPasswordEntry add new password valid"() {
        given:
        def url = ""
        def username = "test user"
        def password = "test pass"
        def accountName = "new accountName"
        assertTrue PassEntry.findByUsernameAndAccountName(username, accountName) == null
        when:
        def result = service.addPasswordEntry(username,password,accountName, url)
        then:
        assertTrue result
        assertEquals PassEntry.findByUsernameAndAccountName(username,accountName).password, password
    }

    void "test editPasswordEntry null id"() {
        given:
        def url = ""
        def id = null
        def accountName = "new accountName"
        def password = "new pass"
        when:
        service.editPasswordEntry(id,accountName,password, url)
        then:
        thrown RuntimeException
    }

    void "test editPasswordEntry null accountName"() {
        given:
        def url = ""
        def id = '1'
        def accountName = null
        def password = "new pass"
        def oldPass = PassEntry.get(id)
        when:
        def result = service.editPasswordEntry(id,accountName,password, url)
        then:
        assertTrue result
        assertEquals password, PassEntry.get(id).password
        assertEquals oldPass.accountName, PassEntry.get(id).accountName
    }

    void "test editPasswordEntry null password (aka only change accountName)"() {
        given:
        def url = ""
        def id = '1'
        def accountName = "new accountName"
        def password = null
        def oldPass = PassEntry.get(id)
        assertEquals "test accountName", oldPass.accountName
        when:
        def result = service.editPasswordEntry(id,accountName,password, url)
        then:
        assertTrue result
        assertEquals "test pass", oldPass.password
        assertEquals oldPass.password, PassEntry.get(id).password
        assertEquals PassEntry.get(id).accountName, accountName
        assertTrue result
    }

    void "test editPasswordEntry all valid"() {
        given:
        def url = ""
        def id = '1'
        def accountName = "new accountName"
        def password = "new pass"
        when:
        def result = service.editPasswordEntry(id,accountName,password, url)
        then:
        assertTrue result
        assertEquals PassEntry.get(id).accountName, accountName
        assertEquals PassEntry.get(id).password, password
    }

    void "test editPasswordEntry invalid id"() {
        given:
        def url = ""
        def id = '10'
        def accountName = "new accountName"
        def password = "new pass"
        when:
        service.editPasswordEntry(id,accountName,password, url)
        then:
        thrown RuntimeException
    }

    void "test removePasswordEntry invalid id"() {
        given:
        def id = 10
        assertEquals null, PassEntry.get(id)
        when:
        def result = service.removePasswordEntry(id)
        then:
        assertFalse result
        assertEquals null, PassEntry.get(id)
    }

    void "test removePasswordEntry valid id"() {
        given:
        def id = 1
        when:
        def result = service.removePasswordEntry(id)
        then:
        assertTrue result
        assertEquals null, PassEntry.get(id)
    }

    void "test removePasswordEntry try to remove twice"() {
        given:
        def id = 1
        when:
        def result = service.removePasswordEntry(id)
        def result_second = service.removePasswordEntry(id)
        then:
        assertTrue result
        assertFalse result_second
    }


}
