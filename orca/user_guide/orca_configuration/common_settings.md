# Common Settings

## Timeout

The first setting is timeout, which allows a user to specify how long (in minutes) the fuzzer should run. It is important to note that if the project has no violation of the property being checked, it will run for the full time specified, so user's should be thoughtful when setting this value to conserve resources.

## Number of Users

This value indicates the number of simulated users OrCa will use when fuzzing the protocol. It is often the case that increasing the number of users will cause OrCa to find the violation more slowly -- however, finding some violations requires multiple users. Thus, users should set the number of users to the lowest number of users they believe could be necessary to find a violation (usually 2 or 3 users suffice).
