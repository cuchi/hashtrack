import 'package:flutter/material.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      theme: new ThemeData(primaryColor: Colors.blue),
      home: new LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  @override
  State createState() => new LoginPageState();
}

class LoginPageState extends State<LoginPage>
    with SingleTickerProviderStateMixin {
  Animation<double> _iconAnimation;
  AnimationController _iconAnimationController;

  @override
  void initState() {
    super.initState();
    _iconAnimationController = new AnimationController(
        vsync: this, duration: new Duration(milliseconds: 500));
    _iconAnimation = new CurvedAnimation(
      parent: _iconAnimationController,
      curve: Curves.bounceOut,
    );
    _iconAnimation.addListener(() => this.setState(() {}));
    _iconAnimationController.forward();
  }

  @override
  Widget build(BuildContext context) {
    final loginButton = new MaterialButton(
      height: 50.0,
      minWidth: 150.0,
      color: Colors.green,
      splashColor: Colors.teal,
      textColor: Colors.white,
      child: Text('Login'),
      onPressed: () {},
    );

    input(label, type, {obscure: false}) => TextFormField(
          decoration: new InputDecoration(labelText: label),
          keyboardType: type,
          obscureText: obscure
        );

    final loginForm = new Form(
      autovalidate: true,
      child: new Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          input("Email", TextInputType.emailAddress),
          input("Password", TextInputType.text, obscure: true),
          new Padding(
            padding: const EdgeInsets.only(top: 60.0),
          ),
          loginButton
        ],
      ),
    );

    return new Scaffold(
      backgroundColor: Colors.white,
      body: new Stack(fit: StackFit.expand, children: <Widget>[
        new Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Hashtrack App',
              style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
            ),
            new Container(padding: const EdgeInsets.all(40.0), child: loginForm)
          ],
        ),
      ]),
    );
  }
}
