class UrlMappings {

    static excludes = ['ssb/app.js']

	static mappings = {

        "/ssb/$controller/$action?/$id?" (parseRequest: true){
            constraints {
                // apply constraints here
            }
        }

        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        // doesn't work.. messes up path to resources?
        "/" {
            controller = "hello"
            action = "index"
        }
        "500"(view:'/error')
	}
}
