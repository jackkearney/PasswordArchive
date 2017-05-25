package hello_world

import org.codehaus.groovy.grails.validation.routines.UrlValidator

class HelloController {
    // Define Services
    def HelloWorldService

    def index (){
    }

    def checkLoggedIn() {
        def msg = session["username"] ? "success" : "Please log in to view this content."
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def getData() {
        def username = session["username"]
        def passList = PassEntry.findAllByUsername((String) username)
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
        try {
            result = helloWorldService.registerAccount(username, password)
        } catch (RuntimeException e) {
            println e
            result = false
        }
        def msg = ""
        if (result) {
            msg = "success"
            session["username"] = username
        } else {
            msg = "Failed to create account."
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def tryLogIn() {
        def req = request.JSON
        def msg = ""
        def username = req["username"]
        def password = req["password"]
        def result
        try {
            result = helloWorldService.tryLogIn(username, password)
        } catch (RuntimeException e) {
            println e
            result = false
        }
        if (result) {
            msg = "success"
            session["username"] = username
        } else {
            msg = "Invalid username or password"
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def logout() {
        session["username"] = null
        // maybe use session.invalidate() ?
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:"success"]
        }
    }

    def addPassword() {
        def req = request.JSON
        def accountName = req["accountName"]
        def password = req["password"]
        def username = session["username"]
        def url = req["url"]
        def msg = ""
        def result
        try {
            result = HelloWorldService.addPasswordEntry(username, password, accountName, url)
        } catch (RuntimeException e) {
            println e
            result = false
        }
        if (result) {
            msg = "success"
        } else {
            msg = "error: could not add Password Entry."
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
        def result
        println req
        try {
            result = HelloWorldService.editPasswordEntry((String) id,(String) newName, (String) newPass,(String) url)
        } catch (RuntimeException e) {
            println e
            result = false
        }
        if (result) {
            msg = "success"
        } else {
            msg = "error: could not complete save of password"
        }
        println msg
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def removePassword() {
        def req = request.JSON
        def msg = ""
        def id = req["id"]
        def result
        try {
            result = HelloWorldService.removePasswordEntry(id)
        } catch (RuntimeException e) {
            println e
            result = false
        }
        if (result) {
            msg = "success"
        } else {
            msg = "error: something went wrong when deleting your entry"
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

    def checkValidUrl() {
        def req = request.JSON
        def url = req["url"]
        def msg = ""
        try {
            UrlValidator urlValidator = new UrlValidator(UrlValidator.ALLOW_ALL_SCHEMES + UrlValidator.ALLOW_2_SLASHES + UrlValidator.NO_FRAGMENTS)
            msg = urlValidator.isValid(url)?"success":"invalid url"
        } catch (Exception e) {
            println e
            msg = "invalid url"
        }
        response.setContentType("application/json")
        render(contentType: "application/json") {
            [status:msg]
        }
    }

}