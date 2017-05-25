package hello_world

class Person {
    String username
    String password

    static constraints = {
        username blank:false, unique:true, size:4..10
        password blank:false, unique:false, size:4..10
    }
}
