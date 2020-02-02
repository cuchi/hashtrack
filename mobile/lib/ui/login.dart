import 'dart:developer';

import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  @override
  State createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage>
    with SingleTickerProviderStateMixin {

  TextFormField _buildInput(String label, TextInputType type,
          {bool obscure = false}) =>
      TextFormField(
          decoration: InputDecoration(labelText: label),
          keyboardType: type,
          obscureText: obscure);

  MaterialButton _buildLoginButton() => MaterialButton(
        height: 50.0,
        minWidth: 150.0,
        color: Colors.blue,
        textColor: Colors.white,
        child: Text('Login'),
        onPressed: () {
          log('Button pressed!');
        },
      );

  Form _buildLoginForm() => Form(
        autovalidate: true,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            _buildInput('Email', TextInputType.emailAddress),
            _buildInput('Password', TextInputType.text, obscure: true),
            Padding(
              padding: const EdgeInsets.only(top: 60.0),
            ),
            _buildLoginButton()
          ],
        ),
      );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(fit: StackFit.expand, children: <Widget>[
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Hashtrack App',
              style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
            ),
            Container(
                padding: const EdgeInsets.all(40.0), child: _buildLoginForm())
          ],
        ),
      ]),
    );
  }
}
