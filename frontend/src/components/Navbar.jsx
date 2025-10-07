import React, { useEffect, useState } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems }
    from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";

const Navbar = () => {
    const navigation = [
        { name: "Home", href: "/", current: true },
        { name: "Chat", href: "/chat", current: false },
        { name: "About", href: "/about", current: false },
    ];

    const [user, setUser] = useState(null);
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/"; // hoặc navigate("/login");
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <Disclosure as="nav" className="fixed top-0 left-0 w-full bg-gray-800 z-50">
            <div className="w-full px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* LEFT: Logo */}
                    <div className="flex items-center">
                        <img
                            alt="Your Company"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            className="h-8 w-auto"
                        />
                    </div>

                    {/* CENTER: Menu */}
                    <div className="hidden sm:flex flex-1 justify-center">
                        <div className="flex space-x-4">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                        'rounded-md px-3 py-2 text-sm font-medium',
                                    )}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Login / Profile */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <button
                                    type="button"
                                    className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="size-6" />
                                </button>

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                        <img
                                            alt={user.name}
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                            className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                                        />
                                    </MenuButton>

                                    <MenuItems
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5"
                                    >
                                        <MenuItem>
                                            <p className="block px-4 py-2 text-sm text-gray-700 font-medium">Hi, {user.name}</p>
                                        </MenuItem>
                                        <MenuItem>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your profile</a>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </>
                        ) : (
                            <Button asChild variant="secondary" className="transition-transform duration-200 hover:scale-105 hover:-translate-y-0.5">
                                <a href="/login">
                                    Login
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default Navbar;
