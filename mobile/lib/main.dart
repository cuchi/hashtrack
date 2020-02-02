import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hashtrack/bloc/authentication/authentication_bloc.dart';
import 'package:hashtrack/bloc/authentication/authentication_event.dart';
import 'package:hashtrack/bloc/authentication/authentication_state.dart';
import 'package:hashtrack/ui/login.dart';

void main(){

  runApp(
    BlocProvider<AuthenticationBloc>(
      create: (context) {
        return AuthenticationBloc()..add(AppStarted());
      },
      child: App()
    )
  );
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.blue),
      home: BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (context, state) {
          if (state is AuthenticationAuthenticated) {
            return Text('Logged in!');
          }
          if (state is AuthenticationUnauthenticated) {
            return LoginPage();
          }
          if (state is AuthenticationLoading) {
            return Text('Loading...');
          }
          return Text('Splash');
        },
      ),
    );
  }
}
