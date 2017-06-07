package hello_world

import org.apache.log4j.Logger

class HelloController {
    def HelloWorldService
    def log = Logger.getLogger(this.getClass())

    def index (){
    }

    def red () {
        redirect(controller: 'hello', action: 'index')
    }

    def checkLoggedIn() {
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [username:session['username']]
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
        def result
        def msg
        try {
            result = helloWorldService.registerAccount(req)
            if (result) {
                msg = "success"
                session["username"] = req["username"]
            } else
                msg = "Oh, no! That username is already taken."
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
        def msg
        try {
            msg = helloWorldService.tryLogIn(req)?"success":"Invalid username or password"
        } catch (Throwable e) {
            log.error(e)
            msg = "Invalid username or password"
        }
        if (msg == "success")
            session["username"] = req['username']

        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status: msg]
        }
    }

    def logout() {
        session["username"] = null
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status: "success"]
        }
    }

    def addPassword() {
        def req = request.JSON
        if (!req["username"])
            req["username"] = session["username"]

        def msg
        def err = "Error: could not add password. Check you do not already have this account listed above."
        try {
            msg = HelloWorldService.addPasswordEntry(req)?"success":err
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
        try {
            msg = HelloWorldService.editPasswordEntry(req)?
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
        try {
            msg = HelloWorldService.removePasswordEntry(req)?"success":"error: something went wrong when deleting your entry"
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

    def saveNewAccountUsername () {
        def req = request.JSON
        def msg = ""
        try {
            msg = HelloWorldService.saveNewAccountUsername(req, session)?"success":" That username is already taken."
            if (msg == "success")
                session["username"] = req["newUsername"]
        } catch (Throwable e) {
            log.error(e)
            msg = "error: something went wrong when changing your username."
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def saveNewAccountPassword () {
        def req = request.JSON
        def msg = ""
        try {
            msg = HelloWorldService.saveNewAccountPassword(req, session)?"success":
                    " The old password is incorrect! Please try again."
        } catch (Throwable e) {
            log.error(e)
            msg = "error: something went wrong when changing your password."
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }
}