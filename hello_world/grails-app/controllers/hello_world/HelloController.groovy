package hello_world

import org.apache.log4j.Logger

class HelloController {
    def HelloWorldService
    def log = Logger.getLogger(this.getClass())

    def index (){
        println "index hello"
        if (session['username'])
            redirect(controller: 'hello', action: 'home')
        else
            render(view: '/hello/index')
    }

    def home() {
        println "home hello"
        if (session['username']) {
            //[username: session['username']]
            render(view: '/hello/home')
        } else {
            redirect(uri: '/hello/index')
        }
    }

    def checkLoggedIn() {
        println "checkLoggedIn"
        def username = session['username']
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [username:username]
        }
    }

    def getData() {
        def username = session["username"]
        def passList
        try {
            passList = HelloWorldService.getData(username)
        } catch (Throwable e) {
            log.error(e)
            passList = []
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [passList:passList,username:username]
        }
    }

    def tryRegister() {
        def req = request.JSON
        def username = req["username"]
        def password = req["password"]
        def result
        def msg
        try {
            result = helloWorldService.registerAccount(username, password)
            if (result) {
                msg = "success"
                session["username"] = username
            } else
                msg = "Username already taken."
        } catch (Throwable e) {
            log.error(e)
            msg = "Failed to create account."
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def tryLogIn() {
        def req = request.JSON
        def result
        def username = req["username"]
        def password = req["password"]
        try {
            result = helloWorldService.tryLogIn(username, password)
        } catch (Throwable e) {
            log.error(e)
        }
        if (result) {
            session["username"] = username
            println "ok redirect from tryLogin"
            //redirect(uri: '/hello/home')
            response.setContentType("application/json")
            render(contentType: "application/json") {
                [status: "success"]
            }
        } else {
            response.setContentType("application/json")
            render(contentType: "application/json") {
                [status: "Invalid username or password"]
            }
        }
    }

    def logout() {
        session["username"] = null
        // maybe use session.invalidate() ?
        println "log out"
        redirect(url: '/hello/index')
    }

    def addPassword() {
        def req = request.JSON
        def accountName = req["accountName"]
        def password = req["password"]
        def username = session["username"]
        def url = req["url"]
        def msg
        try {
            msg = HelloWorldService.addPasswordEntry(username, password, accountName, url)?"success":"Error: could not add password. Check you do not already have this account listed above."
        } catch (Throwable e) {
            log.error(e)
            msg = "Error: could not add password."
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def editPassword() {
        def req = request.JSON
        def msg = ""
        def id =req["id"]
        def newName = req["accountName"]
        def newPass = req["password"]
        def url = req["url"]
        try {
            msg = HelloWorldService.editPasswordEntry((String) id,(String) newName, (String) newPass,(String) url)?
                    "success":"error: could not complete save of password"
        } catch (Throwable e) {
            log.error(e)
            msg = "error: could not complete save of password."
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def removePassword() {
        def req = request.JSON
        def msg = ""
        def id = req["id"]
        try {
            msg = HelloWorldService.removePasswordEntry(id)?"success":"error: something went wrong when deleting your entry"
        } catch (Throwable e) {
            log.error(e)
            msg = "error: something went wrong when deleting your entry"
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def checkValidUrl() {
        def msg
        try {
            def req = request.JSON
            def url = req["url"]
            msg = HelloWorldService.checkUrl(url)?"success":"Please enter a valid url"
        } catch (Throwable e) {
            log.error(e)
            msg = "Please enter a valid url"
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

}