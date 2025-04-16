import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/providers/notification_provider.dart';
import '../../core/view_models/example_view_model.dart';

class ExampleScreen extends StatelessWidget {
  const ExampleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final viewModel = ExampleViewModel(NotificationServiceProvider.of(context));

    return ChangeNotifierProvider.value(
      value: viewModel,
      child: Consumer<ExampleViewModel>(
        builder:
            (context, model, _) => Scaffold(
              appBar: AppBar(title: const Text('Example')),
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (model.isLoading)
                      const CircularProgressIndicator()
                    else ...[
                      ElevatedButton(
                        onPressed: model.performAction,
                        child: const Text('Perform Action'),
                      ),
                      ElevatedButton(
                        onPressed: model.performRiskyAction,
                        child: const Text('Perform Risky Action'),
                      ),
                      if (model.hasError)
                        Text(
                          model.error ?? 'An error occurred',
                          style: TextStyle(color: Colors.red),
                        ),
                    ],
                  ],
                ),
              ),
            ),
      ),
    );
  }
}
