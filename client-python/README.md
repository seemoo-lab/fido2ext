# python-fido2 Extension

In order to implement support for an extension in the [`python-fido2`](https://github.com/Yubico/python-fido2) library by Yubico, some changes to the source code have to be done. The process is straigt forward and only requires modification of a single file.

In `fido2/ctap2/extensions.py`, create a new subclass of `Ctap2Extension`. There are two important Methods that need to be overidded.

- `process_create_input` that controls which input data is passed to the authenticator by data that is received from a relying party
- `process_create_output` that parses the received return data from the authenticator in order to forward it to a relying party

There is no need to register this class anywhere as all subclasses of `Ctap2Extension` in the library are automatically detected.

The *greeter* extension for example looks like this

```python
class GreeterExtension(Ctap2Extension):
    """
    Implements the greeter CTAP2 extension
    """

    NAME = "greeter"

    def process_create_input(self, inputs):
        return self.is_supported() and inputs.get(self.NAME):

    def process_create_output(self, auth_data):
        if self.NAME in auth_data.extensions:
            return {"greeter": auth_data.extensions.get(self.NAME)}
```
