# Interactive Graphics Module - 2020-2021

This assignment saw the creation of "molecule" objects of three types - Healthy (Green), Infected (Red), and Recovered (Purple).

The project aimed to simulate a real-world model of how one infected person can infect several others in the vicinity if they were to not adhere to any precautionary measures (social distancing, mask wearing, etc.) For the purpose of this program, assume that a single "Infected" molecule is an infected person. Should they enter an area with a low number of people present, it will be harder for them to infect someone. The more people ("molecules") there are present, the more chance there is of infecting others. Once others are infected, they too can spread the disease, and in turn this can lead to everyone present becoming infected.

However, those infected can then, after a period of time, "recover". The "Recovered" are denoted by purple "molecules".

An interactive UI enables the user to set parameters such as infection rate, population density, and line/number visibility.
