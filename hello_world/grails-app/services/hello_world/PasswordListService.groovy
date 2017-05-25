package hello_world


class PasswordListService {

    def static registerAccount(String username, String password, String matchingPassword) {
        Person user = new Person(username: username, password: password)
        assert null != user.save(failOnError: true, flush: true)
    }
}
