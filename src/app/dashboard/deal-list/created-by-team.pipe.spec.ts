import { CreatedByTeamPipe } from './created-by-team.pipe';


describe('CreatedByTeamPipe', () => {
    
    it('should create an instance', () => {
        const pipe = new CreatedByTeamPipe();
        expect(pipe).toBeTruthy();
    })

    it('should call transform if isDashboard true' , () => {
     const  myDeals = [{dealCreator:'test1'}];
     const  createdByTeam = true;
     const  loggedInUser = 'test';
     const  isDashboard = true;
     const pipe = new CreatedByTeamPipe();
     expect(pipe.transform(myDeals,createdByTeam,loggedInUser,isDashboard)[0]).toEqual({dealCreator:'test1'})
    });

    it('should call transform if not createdByTeam ' , () => {
        const  myDeals = [{dealCreator:'test1'}];
        const  createdByTeam = false;
        const  loggedInUser = 'test';
        const  isDashboard = false;
        const pipe = new CreatedByTeamPipe();
        expect(pipe.transform(myDeals,createdByTeam,loggedInUser,isDashboard)[0]).toEqual({dealCreator:'test1'})
       });

       it('should call transform if isDashboard is false ' , () => {
        const  myDeals = [{dealCreator:'test1'}];
        const  createdByTeam = true;
        const  loggedInUser = 'test';
        const  isDashboard = false;
        const pipe = new CreatedByTeamPipe();
        expect(pipe.transform(myDeals,createdByTeam,loggedInUser,isDashboard)[0]).toEqual({dealCreator:'test1'})
       });
})