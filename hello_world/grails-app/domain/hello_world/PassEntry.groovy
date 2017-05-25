package hello_world


class PassEntry {
    String accountName
    String password
    String username
    String url
    static constraints = {
        url nullable: true, unique: false, blank: true
        accountName blank: false, unique: false, maxSize: 255
        password blank: false, unique:false, maxSize: 255
        username blank: false, unique: false
    }
}
