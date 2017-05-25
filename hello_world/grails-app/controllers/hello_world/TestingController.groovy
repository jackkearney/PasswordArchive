package hello_world

class TestingController {

    def index() {
    }

    def testMe() {
        println "oh hi"
        println request.JSON

        response.setContentType("application/json")
        render(contentType: "application/json") {
            [x:"2",y:3]
        }
    }
}
