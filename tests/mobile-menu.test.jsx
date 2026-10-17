import React from 'react';
import {it,expect,vi} from 'vitest';
import {render,screen,fireEvent,within} from '@testing-library/react';
import MobileMenu from '../src/navigation/MobileMenu.jsx';
it('opens mobile sections in place and finds treatment links without changing panels',()=>{
 const navigate=vi.fn();render(<MobileMenu id="test-menu" onNavigate={navigate}/>);
 const button=screen.getByRole('button',{name:'Treatments'});
 fireEvent.click(button);expect(button.getAttribute('aria-expanded')).toBe('true');
 expect(screen.getByRole('link',{name:/Upper Eyelid Surgery/})).toBeTruthy();
 fireEvent.change(screen.getByRole('searchbox'),{target:{value:'ptosis'}});
 const menu=screen.getByRole('navigation',{name:'Mobile navigation'});
 const links=within(menu).getAllByRole('link').filter(a=>a.textContent.toLowerCase().includes('ptosis'));
 expect(links.length).toBeGreaterThan(0);fireEvent.click(links[0]);expect(navigate).toHaveBeenCalledOnce();
 fireEvent.change(screen.getByRole('searchbox'),{target:{value:'xyznotfound'}});
 expect(screen.getByRole('status').textContent).toContain('No matching pages');
 expect(screen.getByRole('link',{name:/Book an appointment/})).toBeTruthy();
});
