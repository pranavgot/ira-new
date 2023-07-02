import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-solution',
  templateUrl: './explore-solution.component.html',
  styleUrls: ['./explore-solution.component.scss']
})
export class ExploreSolutionComponent implements OnInit {
  showtable: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
