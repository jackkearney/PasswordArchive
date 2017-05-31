package hello_world
import grails.test.mixin.Mock

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */

import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(HelloController)
@Mock([Person, PassEntry])
class HelloControllerSpec extends Specification {

    def setup() {
        def myPerson = new Person(username: 'Jack',password: 'hello')
        myPerson.save(validate: false)
        def myPass = new PassEntry(username: "test username", accountName: "test accountName", password: "test password")
        myPass.save(validate: false)
    }

    def cleanup() {
    }

    void "test try log in success"() {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.tryLogIn { String username, String password -> return true }
        controller.helloWorldService = serviceMock.createMock()
        controller.tryLogIn()

        then:
        response.json["status"] == "success"
    }

    void "test try log in failure"() {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.tryLogIn { String username, String password -> return false }
        controller.helloWorldService = serviceMock.createMock()
        controller.tryLogIn()

        then:
        response.json["status"] == "Invalid username or password"
    }


    void "test try register success" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.registerAccount { String username, String password -> return true }
        controller.helloWorldService = serviceMock.createMock()
        controller.tryRegister()

        then:
        response.json["status"] == "success"
    }

    void "test try register failure" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.registerAccount { String username, String password -> return false }
        controller.helloWorldService = serviceMock.createMock()
        controller.tryRegister()

        then:
        response.json["status"] != "success"
    }

    void "test getData loggedIn empytData" () {
        when:
        session["username"] = "test user empty"
        controller.getData()

        then:
        response.json["username"] == "test user empty"
        response.json["passList"] == []
    }

    void "test getData logged in has data" () {
        when:
        session["username"] = "test username"
        controller.getData()

        then:
        response.json["username"] == "test username"
        response.json.passList[0].username == 'test username'
        response.json.passList[0].password == 'test password'
        response.json.passList[0].accountName == 'test accountName'
    }

    void "test getData logged out" () {
        when:
        session["username"] = null
        controller.getData()

        then:
        response.json["username"].equals(null)
        response.json["passList"] == []
    }

    void "test tryRegister failure" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.registerAccount { String username, String password -> return false }
        controller.helloWorldService = serviceMock.createMock()
        controller.tryRegister()

        then:
        response.json["status"] == "Failed to create account."
        session["username"].equals(null)
    }

    void "test tryRegister success" () {

        when:
        request.method = 'POST'
        request.json = '{"username":"test username"}'
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.registerAccount { String username, String password -> return true }
        controller.helloWorldService = serviceMock.createMock()
        controller.tryRegister()

        then:
        response.json["status"] == "success"
        session["username"] == "test username"
    }

    void "test logout already logged in" () {
        when:
        session["username"] = "test username"
        controller.logout()

        then:
        response.json["status"] == "success"
        session["username"].equals(null)
    }

    void "test logout not logged in" () {
        when:
        session["username"] = null
        controller.logout()

        then:
        response.json["status"] == "success"
        session["username"].equals(null)
    }

    void "test addPassword success" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.addPasswordEntry { String username, String password, String accountName, String url -> return true }
        controller.helloWorldService = serviceMock.createMock()
        controller.addPassword()

        then:
        response.json["status"] == "success"
    }

    void "test addPassword failure" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.addPasswordEntry { String username, String password, String accountName, String url -> return false }
        controller.helloWorldService = serviceMock.createMock()
        controller.addPassword()

        then:
        response.json["status"] != "success"
        response.json["status"] == "error: could not add Password Entry."
    }

    void "test editPassword success" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.editPasswordEntry { String id, String newName, String newPass, String url -> return true }
        controller.helloWorldService = serviceMock.createMock()
        controller.editPassword()

        then:
        response.json["status"] == "success"
    }

    void "test editPassword failure" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.editPasswordEntry { String id, String newName, String newPass, String url -> return false }
        controller.helloWorldService = serviceMock.createMock()
        controller.editPassword()

        then:
        response.json["status"] != "success"
        response.json["status"] == "error: could not complete save of password"
    }

    void "test removePassword success" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.removePasswordEntry { Long id -> return true }
        controller.helloWorldService = serviceMock.createMock()
        controller.removePassword()

        then:
        response.json["status"] == "success"
    }

    void "test removePassword failure" () {
        when:
        def serviceMock = mockFor(HelloWorldService)
        serviceMock.demand.removePasswordEntry { Long id -> return false }
        controller.helloWorldService = serviceMock.createMock()
        controller.removePassword()

        then:
        response.json["status"] != "success"
        response.json["status"] == "error: something went wrong when deleting your entry"
    }

}
